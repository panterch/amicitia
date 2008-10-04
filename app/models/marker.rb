require 'uuidtools'

class Marker < ActiveRecord::Base
  attr_accessible :title, :body, :lat, :lng, :email

  validates_numericality_of :lat, :lng
  validates_presence_of :title, :body, :email

  before_create :generate_token
  after_create  :send_confirmation_mail

  named_scope :confirmed, :conditions => {:token => nil}

  protected
    def generate_token
      self.token = UUID.random_create.to_s
    end

    def send_confirmation_mail
      Mailer.deliver_marker_created(self)
    end
end
