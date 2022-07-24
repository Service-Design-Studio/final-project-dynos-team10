class MachineType < ApplicationRecord
  has_many :workorders
  validates :type_name, presence: true
  validates :type_name, uniqueness: { scope: :workorder_id}

end
