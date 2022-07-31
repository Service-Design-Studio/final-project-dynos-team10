class FailingReasonsType < ApplicationRecord
  validates :reason, presence: true, uniqueness: true
end
