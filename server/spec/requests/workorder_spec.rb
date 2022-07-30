require 'rails_helper'

RSpec.describe "Workorders", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "PUT #update" do
    it 'returns updated status after updating the component values' do
      machine_type1 = MachineType.create_record("m10")
      machine_type2 = MachineType.create_record("m11")
      workorder = Workorder.create_record("W03",machine_type1.id)
      put workorder_path(workorder), params: { workorder: {id: workorder.id, :machine_type_id => machine_type2.id, :workorder_number => "W02",:completed =>true}}
      workorder.reload
      expected_json =  {"result"=>{"completed"=>true, "created_at"=>workorder.created_at, "id"=>workorder.id, "machine_type_id" => machine_type2.id, "updated_at"=> workorder.updated_at , "user_id"=>nil, "workorder_number"=>"W02"}, "success"=>true}
      puts JSON.parse(response.body)
      expect(JSON.parse(response.body)).to include{expected_json}
    end
  end

end
