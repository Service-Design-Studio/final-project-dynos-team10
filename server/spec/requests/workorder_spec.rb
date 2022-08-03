require 'rails_helper'

RSpec.describe "Workorders", type: :request do
  describe "GET /index" do
    it ' finds a workorder with given workorder number' do
      machine_type = MachineType.create_record("m10")
      workorder = Workorder.create_record("W03",machine_type.id)
      get workorders_path(), params: {:workorder_number => "W03"}
      expected_json =  {"result"=>{"completed"=>false, "passed"=> false, "created_at"=>workorder.created_at, "id"=>workorder.id, "machine_type_id" => machine_type.id, "updated_at"=> workorder.updated_at , "user_id"=>nil, "workorder_number"=>"W03"}, "success"=>true}
      expected_json = JSON.parse(expected_json.to_json)
      expect(JSON.parse(response.body)).to eq(expected_json)
    end
  end

  describe "POST /create" do
    it ' creates a workorder with given workorder number and machine type id' do
      machine_type = MachineType.create_record("m10")
      post workorders_path(), params: {:workorder_number => "W03", :machine_type_id => machine_type.id}
      expected_json =  {"result"=>{"completed"=>false, "passed"=> false, "created_at"=>Workorder.find_one_by_workorder_number("W03").created_at, "id"=>Workorder.find_one_by_workorder_number("W03").id, "machine_type_id" => machine_type.id, "updated_at"=> Workorder.find_one_by_workorder_number("W03").updated_at , "user_id"=>nil, "workorder_number"=>"W03"}, "success"=>true}
      expected_json = JSON.parse(expected_json.to_json)
      expect(JSON.parse(response.body)).to eq(expected_json)
    end
  end

  describe "PUT #update" do
    it 'returns updated status after updating the component values' do
      machine_type1 = MachineType.create_record("m10")
      machine_type2 = MachineType.create_record("m11")
      workorder = Workorder.create_record("W03",machine_type1.id)
      put workorder_path(workorder), params: { workorder: {id: workorder.id, :machine_type_id => machine_type2.id, :workorder_number => "W02",:completed =>true}}
      workorder.reload
      expected_json =  {"result"=>{"completed"=>true, "passed"=> false, "created_at"=>workorder.created_at, "id"=>workorder.id, "machine_type_id" => machine_type2.id, "updated_at"=> workorder.updated_at , "user_id"=>nil, "workorder_number"=>"W02"}, "success"=>true}
      expected_json = JSON.parse(expected_json.to_json)
      expect(JSON.parse(response.body)).to eq(expected_json)
    end

    it 'returns correct passed status when completing a workorder' do
      # creating machine types
      machine_type1 = MachineType.create_record("m20")
      component_type1 = ComponentType.create_record("c20")
      component_type2 = ComponentType.create_record("c21")
      ComponentType.add_machine_type(machine_type1.id,component_type1.id)
      ComponentType.add_machine_type(machine_type1.id,component_type2.id)

      # creating working records
      workorder = Workorder.create_record("W20",machine_type1.id)
      Component.create_record(workorder.id, component_type1.id, true)
      Component.create_record(workorder.id, component_type2.id, true)
      workorder2 = Workorder.create_record("W21",machine_type1.id)
      Component.create_record(workorder2.id, component_type1.id, true)
      Component.create_record(workorder2.id, component_type2.id, false)

      put workorder_path(workorder), params: { workorder: {id: workorder.id, :completed =>true}}
      workorder.reload
      expected_json =  {"result"=>{"completed"=>true, "passed"=> true, "created_at"=>workorder.created_at, "id"=>workorder.id, "machine_type_id" => machine_type1.id, "updated_at"=> workorder.updated_at , "user_id"=>nil, "workorder_number"=>"W20"}, "success"=>true}
      expected_json = JSON.parse(expected_json.to_json)
      expect(JSON.parse(response.body)).to eq(expected_json)

      put workorder_path(workorder2), params: { workorder: {id: workorder2.id, :completed =>true}}
      workorder2.reload
      expected_json =  {"result"=>{"completed"=>true, "passed"=> false, "created_at"=>workorder2.created_at, "id"=>workorder2.id, "machine_type_id" => machine_type1.id, "updated_at"=> workorder2.updated_at , "user_id"=>nil, "workorder_number"=>"W21"}, "success"=>true}
      expected_json = JSON.parse(expected_json.to_json)
      expect(JSON.parse(response.body)).to eq(expected_json)
    end
  end

end
