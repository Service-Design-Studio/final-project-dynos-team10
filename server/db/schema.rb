# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_08_07_085511) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "component_types", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type_name", null: false
  end

  create_table "component_types_failing_reasons_types", id: false, force: :cascade do |t|
    t.bigint "component_type_id", null: false
    t.bigint "failing_reasons_type_id", null: false
  end

  create_table "component_types_machine_types", id: false, force: :cascade do |t|
    t.bigint "machine_type_id", null: false
    t.bigint "component_type_id", null: false
  end

  create_table "components", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "workorder_id"
    t.boolean "status"
    t.bigint "component_type_id"
    t.index ["component_type_id"], name: "index_components_on_component_type_id"
    t.index ["workorder_id"], name: "index_components_on_workorder_id"
  end

  create_table "components_failing_reasons_types", id: false, force: :cascade do |t|
    t.bigint "component_id", null: false
    t.bigint "failing_reasons_type_id", null: false
  end

  create_table "failing_reasons_types", force: :cascade do |t|
    t.string "reason", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "images", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "public_url", limit: 1024
    t.string "auth_url", limit: 1024
    t.bigint "component_id"
    t.index ["component_id"], name: "index_images_on_component_id"
  end

  create_table "machine_types", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type_name", null: false
  end

  create_table "workorders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.citext "workorder_number"
    t.bigint "user_id"
    t.bigint "machine_type_id"
    t.boolean "completed", default: false
    t.boolean "passed", default: false
    t.index ["machine_type_id"], name: "index_workorders_on_machine_type_id"
  end

  add_foreign_key "components", "component_types"
  add_foreign_key "components", "workorders"
  add_foreign_key "images", "components"
end
