class AddEmailTokenToMarker < ActiveRecord::Migration
  def self.up
    add_column :markers, :email, :string
    add_column :markers, :token, :string
  end

  def self.down
    remove_column :markers, :token
    remove_column :markers, :email
  end
end
