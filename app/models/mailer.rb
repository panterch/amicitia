class Mailer < ActionMailer::Base

  def marker_created(marker)
    subject    'Please confirm'
    recipients marker.email
    body       :marker => marker
  end

end
