class FailingReasonsType < ApplicationRecord
  belongs_to :component_type
  has_and_belongs_to_many :components
  validates :reason, presence: true, uniqueness: true

  def self.get_components(failing_reasons_type_id)
    @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
    @failing_reasons_type.components
  end

end
