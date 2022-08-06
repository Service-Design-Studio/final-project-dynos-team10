require 'rails_helper'
require 'pry'


RSpec.describe "Components", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "PUT #update" do
    it 'returns updated status after updating the component values' do
      machine_type = MachineType.create_record("M10")
      component_type1 = ComponentType.create_record("Zzzz")
      component_type2 = ComponentType.create_record("Ssss")
      ComponentType.add_machine_type(machine_type.id,component_type1.id)
      ComponentType.add_machine_type(machine_type.id,component_type2.id)
      work_order_initial = Workorder.create_record("W10",machine_type.id)
      component = Component.create_record(work_order_initial.id, component_type1.id, false)
      work_order_new = Workorder.create_record("W15",machine_type.id)
      # @failing_reasons_type1 = FailingReasonsType.create_record("damaged",component_type1.id)
      # @failing_reasons_type2 = FailingReasonsType.create_record("not sealed",component_type2.id)
      @failing_reasons_type1 = FailingReasonsType.create_record "damaged"
      @failing_reasons_type2 = FailingReasonsType.create_record"not sealed"
      ComponentType.update_failing_reasons_types(component_type1.id, [@failing_reasons_type1.id])
      ComponentType.update_failing_reasons_types(component_type2.id, [@failing_reasons_type2.id])
      Component.update_failing_reasons_types(component.id,[@failing_reasons_type1.id])
      put component_path(component), params: { component: { :workorder_id => work_order_new.id, :component_type_id => component_type2.id,:status => false}, failing_reasons_type_ids:[@failing_reasons_type2.id]}
      component.reload
      expected_json =  {"success"=>true,
                        "result"=>
                          {"component_type_id"=>component_type2.id,
                           "workorder_id"=>work_order_new.id,
                           "status"=>false,
                           "id"=>component.id,
                           "created_at"=>component.created_at,
                           "updated_at"=>component.updated_at}}
      expected_json = JSON.parse(expected_json.to_json)
      expect(component.failing_reasons_type).to eq([@failing_reasons_type2])
      expect(JSON.parse(response.body)).to eq(expected_json)

    end
  end
end
