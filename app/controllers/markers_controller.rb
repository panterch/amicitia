class MarkersController < ApplicationController

  def index
    respond_to do |format|
      format.html
      format.js {render :json => Marker.all}
    end
  end

  def new
  end

  def create
    @marker = Marker.create(params[:marker])
  end

end
