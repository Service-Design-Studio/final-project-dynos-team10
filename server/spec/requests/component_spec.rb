require 'rails_helper'
require 'pry'


RSpec.describe "Components", type: :request do
  describe "GET /index" do
    pending "add some examples (or delete) #{__FILE__}"
  end

  describe "PUT #update" do
    it 'returns updated status after updating the component values' do
      work_order_initial = Workorder.create_record("10",1)
      component = Component.create_record(work_order_initial.id,"wire",false, [])
      work_order_new = Workorder.create_record("15",1)

      put component_path(component), params: { component: {:component_type => "label", :workorder_id => work_order_new.id, :status => false, :failing_reasons => ["wrong position"]}}
      component.reload

      expected_json =  {"success"=>true,
                        "result"=>
                          {"component_type"=>"label",
                           "workorder_id"=>work_order_new.id,
                           "status"=>false,
                           "id"=>component.id,
                           "created_at"=>component.created_at,
                           "updated_at"=>component.updated_at,
                           "failing_reasons"=>["wrong position"]}}

      expect(JSON.parse(response.body)).to include{expected_json}

    end
  end
end
