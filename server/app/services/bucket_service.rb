require "google/cloud/storage"

class BucketService
  attr_reader :storage, :bucket, :public_url_prefix, :auth_url_prefix

  def initialize
    super
    @storage = Google::Cloud::Storage.new(
      project_id: "tsh-qc",
      credentials: "config/service-account-credentials.json"
    )
    gcs_bucket_name = Rails.env.production? ? "dynostic-server-bucket" : "dynostic-test-bucket"
    @bucket = storage.bucket gcs_bucket_name
    @public_url_prefix = "storage.googleapis.com"
    @auth_url_prefix = "storage.cloud.google.com"
  end

  def get_file(filename)
    @bucket.file filename
  end

  # Transforms the public url to the authenticated url for a GCS bucket.
  # This method exists because GCS does not provide a method to return the authenticated url, but only a public url
  def get_auth_url_from_public(public_url)
    public_url.sub @public_url_prefix, @auth_url_prefix
  end

  def create_image(base64_string, filename)
    begin
      File.open("temp.png", "wb") do |f|
        f.write(Base64.decode64(base64_string['data:image/png;base64,'.length .. -1]))
      end
      return @bucket.create_file("temp.png", filename)
    rescue
      puts "error when creating image"
    ensure
      File.unlink("temp.png")
    end
  end

  def delete_file(file_pub_url)
    # extract file name
    file_name = file_pub_url.split("/")[4]
    file = @bucket.file file_name
    file.delete
    puts "Deleted #{file.name}"
  end

end
