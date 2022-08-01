class FailingReasonsType < ApplicationRecord
  belongs_to :component_type
  has_and_belongs_to_many :components
  validates :reason, presence: true, uniqueness: true
end
