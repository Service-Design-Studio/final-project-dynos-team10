require 'rails_helper'
require 'pry'


RSpec.describe "Components", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "PUT #update" do
    it 'returns updated status after updating the component values' do
      machine_type = MachineType.create_record("m10")
      component_type1 = ComponentType.create_record("zzzz")
      component_type2 = ComponentType.create_record("ssss")
      ComponentType.add_machine_type(machine_type.id,component_type1.id)
      ComponentType.add_machine_type(machine_type.id,component_type2.id)
      work_order_initial = Workorder.create_record("W10",machine_type.id)
      component = Component.create_record(work_order_initial.id, component_type1.id, [])
      work_order_new = Workorder.create_record("W15",machine_type.id)

      put component_path(component), params: { component: { :workorder_id => work_order_new.id, :component_type_id => component_type2.id,:status => false, :failing_reasons => ["wrong position"]}}
      component.reload

      expected_json =  {"success"=>true,
                        "result"=>
                          {"component_type_id"=>component_type2.id,
                           "workorder_id"=>work_order_new.id,
                           "status"=>false,
                           "id"=>component.id,
                           "created_at"=>component.created_at,
                           "updated_at"=>component.updated_at,
                           "failing_reasons"=>["wrong position"]}}
      expected_json = JSON.parse(expected_json.to_json)

      expect(JSON.parse(response.body)).to eq(expected_json)

    end
  end
end
