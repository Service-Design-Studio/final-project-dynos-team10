class Image < ApplicationRecord
  # TODO: add component_id here for validation, must link to a component before saving
  validates :public_url, presence: true
  belongs_to :component

  def self.create_new_image(image_file)
    public_url = image_file.public_url
    auth_url = BUCKET.get_auth_url_from_public public_url
    Image.create(public_url: public_url, auth_url: auth_url)
  end

  def self.find_one(image_id)
    Image.find_by(id: image_id)
  end

  def self.find_all_by_component_id(component_id)
    Image.where(["component_id = ?", component_id])
  end
end
