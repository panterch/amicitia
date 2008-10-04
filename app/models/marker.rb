class Marker < ActiveRecord::Base
  attr_accessible :title, :body, :lat, :lng

  validates_numericality_of :lat, :lng
end
