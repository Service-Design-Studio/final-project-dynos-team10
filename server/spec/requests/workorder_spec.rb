require 'rails_helper'

RSpec.describe "Workorders", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "PUT #update" do
    it 'returns updated status after updating the component values' do
      machine_type = MachineType.create_record("m10")
      workorder = Workorder.create_record("W03",machine_type.id)
      put workorder_path(workorder), params: { workorder: {id: workorder.id, :machine_type_id => 2, :workorder_number => "15"}}
      workorder.reload
      expected_json =  {"success"=>true,
                        "result"=>{"workorder_number"=>"15", "machine_type_id"=>"2", "id"=>workorder.id, "created_at"=>workorder.created_at, "updated_at"=>workorder.updated_at, "user_id"=>nil}}

      expect(JSON.parse(response.body)).to include{expected_json}
    end
  end

end
