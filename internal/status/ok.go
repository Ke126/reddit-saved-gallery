package status

// Ok returns true if the status code is in the range 200-299
func Ok(statusCode int) bool {
	return statusCode >= 200 && statusCode <= 299
}
