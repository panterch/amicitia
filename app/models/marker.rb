require 'uuidtools'

class Marker < ActiveRecord::Base
  attr_accessible :title, :body, :lat, :lng, :email, :date

  validates_numericality_of :lat, :lng
  validates_presence_of :title, :body, :email, :date
  validates_uniqueness_of :token, :allow_nil => true

  before_create :generate_token
  after_create  :send_confirmation_mail

  named_scope :confirmed, :conditions => {:token => nil}
  named_scope :recent, :limit => 10, :order => "date DESC"
  named_scope :dated, lambda { |time_ago| { :conditions =>
    ['date > ?', time_ago ] } }

  protected
    def generate_token
      self.token = UUID.random_create.to_s
    end

    def send_confirmation_mail
      Mailer.deliver_marker_created(self)
    end
end
