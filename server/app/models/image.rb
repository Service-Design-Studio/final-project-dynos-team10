class Image < ApplicationRecord
  validates :public_url, :component_id, presence: true
  belongs_to :component
  # TODO: has_many through associations with work order

  def self.create_record(component_id, image_file)
    public_url = image_file.public_url
    auth_url = BUCKET.get_auth_url_from_public public_url
    Image.create(public_url: public_url, auth_url: auth_url, component_id: component_id)
  end

  def self.find_one(image_id)
    Image.find_by(id: image_id)
  end

  def self.find_all
    Image.all
  end

  def self.find_all_by_component_id(component_id)
    Image.where(["component_id = ?", component_id])
  end
end
