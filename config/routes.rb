ActionController::Routing::Routes.draw do |map|

  map.confirm 'confirm/:token',
    :controller => 'markers',
    :action     => 'update'

  map.resources :markers
  map.root :controller => "markers"

end
