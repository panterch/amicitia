class AddDateToMarker < ActiveRecord::Migration
  def self.up
    add_column :markers, :date, :date
  end

  def self.down
    remove_column :markers, :date
  end
end
