<%inherit file="layout.mako"/>
<h1 class="text-center">World db</h1>

<div id="app">
</div>

<script type="text/javascript">
  window.URLS = {
    continents: "${request.route_path('continents')}",
    regions: "${request.route_path('regions')}",
    countries: "${request.route_path('countries')}",
    cities: "${request.route_path('cities', countrycode=':code')}",
    languages: "${request.route_path('languages', countrycode=':code')}",
    city: "${request.route_path('city', id=':id')}",
    cityCreate: "${request.route_path('city-create', countrycode=':code')}",
  }
</script>

<script src="${request.static_path('world_db:static/app.js')}"></script>
