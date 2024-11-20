package status

import "strconv"

type FetchStatusErr struct {
	StatusCode int
}

func (e *FetchStatusErr) Error() string {
	return "fetch failed with status " + strconv.Itoa(e.StatusCode)
}
