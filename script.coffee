class Location extends Backbone.Model
    parse: (data) ->
        console.log(data)

    getWeather: () ->
        weatherJSONURL = "https://api.openweathermap.org/data/2.5/weather?q=#{@.attributes.cityName}&appid=7040d6303d83bfe36cc2fad1c5a7ae97&units=metric";
        $.ajax
            method: "GET"
            url: weatherJSONURL
            dataType: 'JSON'

class Locations extends Backbone.Collection
    model: Location


class WeatherCardView extends Backbone.View

    tagName: 'div'

    initialize: ->
        @model.bind 'change', @render
        
    render: ->
        res = @model.getWeather()
        name = @model.get 'cityName'
        self = @
        res.then (data) ->
            console.log data
            $(self.el).html """
                <sl-card class="card-header m-4">
                    <div slot="header" class="min-w-80 flex items-center justify-between">
                        <h4>Weather in #{data.name}</h4>
                        <sl-icon-button name="trash" label="Delete" class="delete-btn text-red-600"></sl-icon-button>
                    </div>

                    <p>Temperature: #{data.main.temp}°C</p>
                    <p>Precipitaion: #{data.main.humidity}%</p>
                </sl-card>
            """
            return self
        .catch (err) ->
            self.remove()
            alert("City not found " + name);
            return @

        $(@el).append "<h4>Loading...</h4>"
        @

    remove: ->
        @model.destroy()
        $(@el).remove()

    events:
        'click .delete-btn': 'remove'

class InputView extends Backbone.View
    tagName: "div"

    initialize: ->
        $(@el).addClass "flex align-center items-center"

    render: ->
        $(@el).html """
            <sl-input id="city_name_input" placeholder="Enter city name" class="mr-4"></sl-input>
            <sl-button id="add_btn">Add +</sl-button>
        """
        @

    addLocation: ->
        name = $("#city_name_input").val()
        if not name
            return
        location = new Location
        location.set 'cityName', name
        location.fetch success: -> console.log(location.attributes)
        $("#city_name_input").val("")
        @model.add location

    
    events: 'click #add_btn': 'addLocation'



class AppView extends Backbone.View
    el: $('#app')

    initialize: ->
        $(@el).addClass "flex flex-col items-center p-4"
        @locations = new Locations
        @locations.bind 'add', @appendItem
        @inputView = new InputView model: @locations
        @render();

    render: ->
        $(@el).append @inputView.render().el
        $(@el).append "<div id='weather-cards' class='weather-cards m-8 flex flex-wrap'></div>"

    appendItem: (item) ->
        item_view = new WeatherCardView model: item
        $("#weather-cards").append item_view.render().el

Backbone.sync = (method, model, success, error) ->
    if success.success
        success.success()
    else
        console.log method
        success()

appView = new AppView