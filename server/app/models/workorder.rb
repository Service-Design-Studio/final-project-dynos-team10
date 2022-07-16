class Workorder < ApplicationRecord
    has_many :components
    # TODO: sort out validations
    validates :workorder_number, :machine_type, presence: true
    validates :workorder_number, uniqueness: true

    paginates_per 5

    # creates a new workorder
    def self.create_record(workorder_number, machine_type)
        Workorder.create(workorder_number: workorder_number, machine_type: machine_type)
    end

    def self.find_paginated(page_number)
        Workorder.order(id: :desc).page page_number
    end

    def self.find_all
        Workorder.all
    end

    def self.find_one(workorder_id)
        Workorder.find_by(id: workorder_id)
    end

    def self.find_one_by_workorder_number(workorder_number)
        Workorder.find_by(workorder_number: workorder_number)
    end

    def self.get_count
        Workorder.count
    end

    def self.get_one_components(workorder_id)
        Workorder.find_by(id: workorder_id).components
    end

    # TODO: test whether this works
    #doesnt work as intended while doing rspec testing
    # def self.get_failing_reasons(workorder_id)
    #     # workorder = self.find_one(workorder_id)
    #     # all_comps = Component.find_all_by_workorder_id(workorder_id)
    #     failing_reasons = []
    #     # byebug
    #     puts "all comps us"
    #     all_comps = Component.find_all_by_workorder_id(workorder_id)
    #     failing_reasons = [all_comps.get_failing_reasons(Component.get_failing_reasons(all_comps.id))]
    #     # puts all_comps
    #     # Component.find_all_by_workorder_id(workorder_id) do |comp|
    #     #     failing_reasons << comp.get_failing_reasons(id: comp.id)
    #     #     puts "component is"
    #     #     puts comp
    #     #     puts "failing reason is"
    #     #     puts failing_reasons

    #     # end
    #     return failing_reasons
    #     # @components = Component.find_all_by_workorder_id(workorder_id)
    #     # components.each do |comp|
    #     #     failing_reasons << comp.get_failing_reasons(id: comp.id)
    #     # return failing_reasons
    #     # end
    # end

    # def self.get_status(workorder_id)
    #     @components = Component.find_all_by_workorder_id(workorder_id)
    #     components.each do |comp|
    #         if(comp.get_status(id: comp.id)==false)
    #             return false
    #         end
    #     end
    #     true
    # end
end
