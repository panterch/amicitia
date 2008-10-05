class MarkersController < ApplicationController

  def index
    respond_to do |format|
      format.html do 
        @recent = Marker.recent.confirmed
      end
      format.js {render :json => Marker.confirmed}
    end
  end

  def new
    @marker = Marker.new
  end

  def create
    @marker = Marker.new(params[:marker])
    if @marker.save
      render
    else
      render :action => :new
    end
  end

  def update
    raise SecurityError unless params[:token]
    @marker = Marker.find_by_token(params[:token])
    raise SecurityError unless @marker
    @marker.update_attribute(:token, nil)
    redirect_to :action => "index"
  end

end
