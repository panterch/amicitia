class MarkersController < ApplicationController

  before_filter :load_markers, :only => [:index, :show]

  def index
    respond_to do |format|
      format.html 
      format.rss
      format.js {render :json => @markers}
    end
  end

  def show
    @marker = Marker.find(params[:id])
    respond_to do |format|
      format.html
      format.js
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
    redirect_to @marker
  end

  protected
    
    def load_markers
      @markers = Marker.recent.confirmed
    end

end
