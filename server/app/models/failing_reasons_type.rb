class FailingReasonsType < ApplicationRecord
  # belongs_to :component_type
  has_and_belongs_to_many :component_types
  has_and_belongs_to_many :components
  validates :reason, presence: true, uniqueness: true

  after_initialize do
    self.reason = reason.titleize
  end
  # def self.create_record(reason,component_type_id)
  #   FailingReasonsType.create(reason:reason, component_type_id: component_type_id)
  # end

  def self.create_record(reason)
    FailingReasonsType.create(reason: reason.titleize)
  end

  def self.get_components(failing_reasons_type_id)
    @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
    @failing_reasons_type.components
  end

  def self.get_component_type(failing_reasons_type_id)
    @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
    @failing_reasons_type.component_type
  end

  def self.find_all
    FailingReasonsType.all
  end

  def self.find_one(failing_reasons_type_id)
   FailingReasonsType.find_by(id: failing_reasons_type_id)
  end

  def self.add_component_type(component_type_id, failing_reasons_type_id)
    @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
    @comp_type = ComponentType.find_by(id: component_type_id)
    @comp_type.failing_reasons_types.push(@failing_reasons_type) unless @comp_type.failing_reasons_types.include?(@failing_reasons_type)
    @failing_reasons_type.component_types.push(@comp_type) unless @failing_reasons_type.component_types.include?(@comp_type)
    @comp_type.save
    @failing_reasons_type.save
  end

  def self.remove_component_type(component_type_id, failing_reasons_type_id)
    @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
    @comp_type = ComponentType.find_by(id: component_type_id)
    @comp_type.failing_reasons_types.delete(@machine_type)
    @failing_reasons_type.component_types.delete(@comp_type)
    @comp_type.save
    @failing_reasons_type.save
  end

  def self.update_failing_reasons_types(component_type_id, failing_reasons_type_ids)
    @comp_type = ComponentType.find_by(id: component_type_id)
    @comp_type.failing_reasons_types.clear
    failing_reasons_type_ids.each do |failing_reasons_type_id|
      ComponentType.add_failing_reasons_type(failing_reasons_type_id, component_type_id)
    end
  end
end
