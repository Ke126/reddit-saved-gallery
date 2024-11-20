package service

import (
	"encoding/json"
	"os"
	"testing"
)

func TestSerialization(t *testing.T) {
	data, _ := os.ReadFile("./testdata.json")

	t.Run("marshals reddit json data correctly", func(t *testing.T) {
		var out redditPostsBody
		err := json.Unmarshal([]byte(data), &out)

		if err != nil {
			t.Error("got error")
		}

		gotAfter, wantAfter := out.Data.After, "post5"
		if gotAfter != wantAfter {
			t.Errorf("got %s, want %s", gotAfter, wantAfter)
		}

		gotDist, wantDist := out.Data.Dist, 5
		if gotAfter != wantAfter {
			t.Errorf("got %d, want %d", gotDist, wantDist)
		}

		gotLen, wantLen := len(out.Data.Children), 5
		if gotLen != wantLen {
			t.Errorf("got %d, want %d", gotLen, wantLen)
		}

		// sanity check
		gotFirstId, wantFirstId := out.Data.Children[0].(map[string]any)["data"].(map[string]any)["name"], "post1"
		if gotFirstId != wantFirstId {
			t.Errorf("got %s, want %s", gotFirstId, wantFirstId)
		}
	})

	t.Run("unmarshals parsed reddit json data correctly", func(t *testing.T) {
		var out redditPostsBody
		err := json.Unmarshal([]byte(data), &out)

		if err != nil {
			t.Error("got error")
		}

		parsed := &parsedPosts{Timestamp: 12345, Posts: &out.Data.Children}
		outStr, err := json.Marshal(parsed)

		if err != nil {
			t.Error("got error")
		}

		got := string(outStr)
		want := `{"timestamp":12345,"posts":[{"data":{"name":"post1"},"kind":"t3"},{"data":{"name":"post2"},"kind":"t3"},{"data":{"name":"post3"},"kind":"t3"},{"data":{"name":"post4"},"kind":"t3"},{"data":{"name":"post5"},"kind":"t3"}]}`

		if got != want {
			t.Errorf("got %s, want %s", got, want)
		}
	})
}
