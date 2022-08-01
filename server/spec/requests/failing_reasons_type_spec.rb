require 'rails_helper'

RSpec.describe "FailingReasonsTypes", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "DELETE /destroy" do
    it 'destroys the failing reason type removes it from the lists of machine types and returns the destroy record details' do
      @machine_type = MachineType.create_record("m9")
      @component_type = ComponentType.create_record("box")
      ComponentType.add_machine_type(@machine_type.id,@component_type.id)
      @work_order = Workorder.create_record("W005",@machine_type.id)
      @component = Component.create_record(@work_order.id,@component_type.id,false)
      @failing_reasons_type = FailingReasonsType.create_record("damaged",@component_type.id)
      Component.update_failing_reasons_types(@component.id,[@failing_reasons_type.id])
      expected_json =  {"success"=>true, "result"=>{"id"=>@failing_reasons_type.id, "reason"=>"damaged", "created_at"=>@failing_reasons_type.created_at, "updated_at"=>@failing_reasons_type.updated_at, "component_type_id"=>@component_type.id}}
      expected_json = JSON.parse(expected_json.to_json)
      delete failing_reasons_type_path(@failing_reasons_type)
      @component.reload
      @component_type.reload
      expect(@component_type.failing_reasons_types).to be_empty
      expect(@component.failing_reasons_type).to be_empty
      expect(JSON.parse(response.body)).to eq(expected_json)
    end
  end

  describe "GET /show" do
    it 'shows the failing reason type from and id' do
      @machine_type = MachineType.create_record("m9")
      @component_type = ComponentType.create_record("box")
      ComponentType.add_machine_type(@machine_type.id,@component_type.id)
      @work_order = Workorder.create_record("W005",@machine_type.id)
      @component = Component.create_record(@work_order.id,@component_type.id,false)
      @failing_reasons_type = FailingReasonsType.create_record("damaged",@component_type.id)
      Component.update_failing_reasons_types(@component.id,[@failing_reasons_type.id])
      expected_json =  {"success"=>true, "result"=>{"id"=>@failing_reasons_type.id, "reason"=>"damaged", "created_at"=>@failing_reasons_type.created_at, "updated_at"=>@failing_reasons_type.updated_at, "component_type_id"=>@component_type.id}}
      expected_json = JSON.parse(expected_json.to_json)
      get failing_reasons_type_path(@failing_reasons_type)
      expect(JSON.parse(response.body)).to eq(expected_json)
    end
  end


end
