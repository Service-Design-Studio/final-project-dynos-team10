require 'rails_helper'

RSpec.describe "Components", type: :request do
  describe "GET /index" do
    pending "add some examples (or delete) #{__FILE__}"
  end

  describe "PATCH #update" do
    it 'returns updated status after updating the component values' do
      work_order = Workorder.create_record("10",1)
      @component = Component.create_record(work_order.id,"wire",false)
      patch :update, id: @component.id, component: {:component_type => "label", :workorder_id => "5",:failing_reasons => ["wrong position"],:status => false}
      puts comp1

      # expect(response.)
      # headers = { "ACCEPT" => "success_json" }
      # put "/components/", :params => { :component => {:id => "1", :component_type => "label", :workorder_id => "5",:failing_reasons => ["wrong position"],:status => false} }, :headers => headers
      # expect(response.content_type).to eq("application/json; charset=utf-8")
      # expect(response).to have_http_status(:updated)
    end
  end
end
