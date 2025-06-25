var google;

// Global function for Google Maps callback
function initMap() {
    console.log('Google Maps API loaded, initializing map...');
    init();
}

function init() {
    console.log('Map initialization started...');
    
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API not loaded');
        var mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;"><h3>Map Loading Error</h3><p>Unable to load Google Maps. Please check your internet connection.</p><a href="https://maps.app.goo.gl/P5mEVBS5BVXTWC5G6" target="_blank" style="color: #1e40af;">View Location on Google Maps</a></div>';
        }
        return;
    }
    
    // Check if map element exists
    var mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    console.log('Map element found, creating map...');
    
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    
    // Updated coordinates for the wedding venue location (Manila, Philippines)
    var myLatlng = new google.maps.LatLng(14.5995, 120.9842);
    
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: myLatlng,

        // How you would like to style the map. 
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]}]
    };

    try {
        // Create the Google Map using our element and options defined above
        var map = new google.maps.Map(mapElement, mapOptions);
        console.log('Map created successfully');
        
        // Add a marker for the wedding venue
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Wedding Venue - Bethel Guest House',
            icon: 'images/loc.png'
        });
        
        console.log('Marker added successfully');
        
        // Add an info window for the marker
        var infowindow = new google.maps.InfoWindow({
            content: '<div style="text-align: center; padding: 10px;"><h4 style="margin: 0 0 5px 0; color: #1e3a8a;">Wedding Venue</h4><p style="margin: 0; color: #666;">Bethel Guest House</p><p style="margin: 5px 0; color: #666;">Manila, Philippines</p><a href="https://maps.app.goo.gl/P5mEVBS5BVXTWC5G6" target="_blank" style="color: #1e40af; text-decoration: none; font-weight: bold;">View on Google Maps</a></div>'
        });
        
        // Add click event to marker to show info window
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
        
        // Open info window by default
        infowindow.open(map, marker);
        
        console.log('Map initialization completed successfully');
        
    } catch (error) {
        console.error('Error creating map:', error);
        mapElement.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;"><h3>Map Error</h3><p>Unable to load the map. Please try refreshing the page.</p><a href="https://maps.app.goo.gl/P5mEVBS5BVXTWC5G6" target="_blank" style="color: #1e40af;">View Location on Google Maps</a></div>';
    }
}

// Fallback initialization if callback doesn't work
function loadMap() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                init();
            } else {
                // Wait a bit more for Google Maps to load
                setTimeout(loadMap, 100);
            }
        });
    } else {
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            init();
        } else {
            // Wait a bit more for Google Maps to load
            setTimeout(loadMap, 100);
        }
    }
}

// Start the map loading process as fallback
loadMap();