require "google/cloud/storage"

class BucketService
  attr_reader :storage, :bucket

  def initialize
    super
    @storage = Google::Cloud::Storage.new(
      project_id: "tsh-qc",
      credentials: "config/service-account-credentials.json"
    )
    @bucket = storage.bucket "dynostic-server-bucket"
  end

  def get_file(filename)
    @bucket.file filename
  end

  def create_image(base64_string, filename)
    begin
      File.open("temp.png", "wb") do |f|
        f.write(Base64.decode64(base64_string['data:image/png;base64,'.length .. -1]))
      end
      @bucket.create_file("temp.png", filename)
    rescue
      puts "error when creating image"
    ensure
      File.unlink("temp.png")
    end
  end
end