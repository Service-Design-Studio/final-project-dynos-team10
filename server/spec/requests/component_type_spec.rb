require 'rails_helper'

RSpec.describe "ComponentTypes", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "GET /get_all_failing_reasons_types" do
    it 'returns all the failing reasons types records for given component type id' do
      @component_type = ComponentType.create_record("box")
      @failing_reasons_type1 = FailingReasonsType.create_record("damaged",@component_type.id)
      @failing_reasons_type2 = FailingReasonsType.create_record("not sealed",@component_type.id)
      get failing_reasons_types_component_type_path(@component_type), params: {id: @component_type.id}
      expected_json = {"success"=>true, "result"=>[{"id"=>@failing_reasons_type1.id, "reason"=>"damaged", "created_at"=>@failing_reasons_type1.created_at, "updated_at"=>@failing_reasons_type1.updated_at, "component_type_id"=>@component_type.id}, {"id"=>@failing_reasons_type2.id, "reason"=>"not sealed", "created_at"=>@failing_reasons_type2.created_at, "updated_at"=>@failing_reasons_type2.created_at, "component_type_id"=>@component_type.id}]}
      expected_json = JSON.parse(expected_json.to_json)
      expect(JSON.parse(response.body)).to eq(expected_json)

    end
  end

  describe "DELETE /destroy" do
    it 'destroys the component type removes it from the lists of machine types and returns the destroy record details' do
      @component_type = ComponentType.create_record("box")
      @machine_type1 = MachineType.create_record("m8")
      @machine_type2 = MachineType.create_record("m9")
      ComponentType.add_machine_type(@machine_type2.id,@component_type.id)
      ComponentType.add_machine_type(@machine_type1.id,@component_type.id)
      expected_json =  {"success"=>true, "result"=>{"type_name"=>"box", "id"=>@component_type.id, "created_at"=>@component_type.created_at, "updated_at"=>@component_type.updated_at}}
      expected_json = JSON.parse(expected_json.to_json)
      delete component_type_path(@component_type)
      @machine_type2.reload
      @machine_type1.reload
      expect(@machine_type1.component_types).to be_empty
      expect(@machine_type2.component_types).to be_empty
      expect(JSON.parse(response.body)).to eq(expected_json)
    end
  end

  describe "PUT #update" do
    it 'returns updated status as true after updating the machine type values' do
      machine_type_1 = MachineType.create_record("m5")
      machine_type_2 = MachineType.create_record("m6")
      machine_type_3 = MachineType.create_record("m7")

      component_type = ComponentType.create_record("zzzz")
      # puts component_type.id


      ComponentType.add_machine_type(machine_type_1.id,component_type.id)
      ComponentType.add_machine_type(machine_type_2.id,component_type.id)
      # all_mt = ComponentType.get_all_machine_types_from_id(component_type.id)
      # all_mt.each do |mt|
      #   puts mt.type_name
      # end


      # work_order_new = Workorder.create_record("15",1)

      put component_type_path(component_type), params: { component_type: {:type_name => "gggg"},machine_type_ids: [machine_type_2.id,machine_type_3.id]}
      component_type.reload
      # all_mt = ComponentType.get_all_machine_types_from_id(component_type.id)
      # all_mt.each do |mt|
      #   puts mt.type_name
      # end


      expected_json =  {"success"=>true, "result"=>{"type_name"=>"gggg", "id"=>component_type.id, "created_at"=>component_type.created_at, "updated_at"=>component_type.updated_at}}
      expected_json = JSON.parse(expected_json.to_json)

      expect(JSON.parse(response.body)).to eq(expected_json)

    end
  end
end
