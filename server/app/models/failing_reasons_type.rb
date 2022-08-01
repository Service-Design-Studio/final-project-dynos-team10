class FailingReasonsType < ApplicationRecord
  belongs_to :component_type
  validates :reason, presence: true, uniqueness: true
end
