require 'uuidtools'

class Marker < ActiveRecord::Base
  attr_accessible :title, :body, :lat, :lng, :email

  validates_numericality_of :lat, :lng
  validates_presence_of :title, :body, :email
  validates_uniqueness_of :token, :allow_nil => true

  before_create :generate_token
  after_create  :send_confirmation_mail

  named_scope :confirmed, :conditions => {:token => nil}
  named_scope :recent, :limit => 3, :order => "created_at DESC"

  protected
    def generate_token
      self.token = UUID.random_create.to_s
    end

    def send_confirmation_mail
      Mailer.deliver_marker_created(self)
    end
end
