class FailingReasonsType < ApplicationRecord
  belongs_to :component_type
  has_and_belongs_to_many :components
  validates :reason, presence: true, uniqueness: true

  def self.create_record(reason,component_type_id)
    FailingReasonsType.create(reason:reason, component_type_id: component_type_id)
  end

  def self.get_components(failing_reasons_type_id)
    @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
    @failing_reasons_type.components
  end

  def self.find_all
    FailingReasonsType.all
  end

  def self.find_one(failing_reasons_type_id)
   FailingReasonsType.find_by(id: failing_reasons_type_id)
  end

end
