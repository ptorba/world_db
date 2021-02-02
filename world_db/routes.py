def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('continents', '/continents')
    config.add_route('regions', '/regions')
    config.add_route('countries', '/countries')
    config.add_route('cities', '/cities')
