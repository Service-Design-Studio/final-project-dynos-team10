require "rails_helper"

RSpec.describe "BucketServiceSpec" do
  context "initialise" do
    it "should have non-nil url prefixes" do
      expect(BUCKET.public_url_prefix.nil? || BUCKET.auth_url_prefix.nil?).to be false
    end
  end

  context "METHOD: public_url_prefix" do
    it 'should transform public url to auth url and return a new string' do
      test_public_url = "https://#{BUCKET.public_url_prefix}/test"
      test_auth_url = BUCKET.get_auth_url_from_public test_public_url
      # compare object identity and value
      expect(test_public_url).not_to be test_auth_url
    end
  end
end