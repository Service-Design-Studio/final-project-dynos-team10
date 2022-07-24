class ComponentType < ApplicationRecord
  has_many :components
  validates :type_name, presence: true
  validates :type_name, uniqueness: { scope: :workorder_id}
end
