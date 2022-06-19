require "test_helper"

class BucketServiceTest < ActiveSupport::TestCase
  test "non-nil url prefixes" do
    assert !(BUCKET.public_url_prefix.nil? || BUCKET.auth_url_prefix.nil?)
  end

  test "transform public url to auth url should return a new string" do
    test_public_url = "https://#{BUCKET.public_url_prefix}/test"
    test_auth_url = BUCKET.get_auth_url_from_public test_public_url
    assert test_public_url != test_auth_url
  end
end