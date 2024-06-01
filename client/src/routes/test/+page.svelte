<script>
	import { enhance } from '$app/forms';
</script>

<form
	method="POST"
	use:enhance={() =>
		({ update }) =>
			update({ reset: false })}
>
	<input type="search" name="q" />
	<input type="submit" />
</form>


<p>{"2nd Edit: just read u/Away-Commercial-4380 comment [here](https://www.reddit.com/r/theydidthemath/comments/1ctay7r/comment/l4aqgv8/?utm_source=share&amp;utm_medium=web3x&amp;utm_name=web3xcss&amp;utm_term=1&amp;utm_content=share_button). I got it slightly wrong.\n\nThere are 42 pills\n\nThere are 3 possibilities:\n\n1. No black pill\n2. Black pill + another pill\n3. Two black pills\n\nFirst one makes you \"lose\", second one makes you progress if the other pill is a new one, and the third one gives you a second life essentially, so next time you'd have lost you don't.\n\nEvery round you have \\~95.3% chance of losing, a \\~2.38% chance of another pill, and \\~2.38% chance of gaining another life.\n\nGaining a new life can be summarised as increasing both the chance to lose as well as win. It increases chance to lose by \\~2.32%, and chance of another pill by 0.06%, so we can simplify each round as:\n\n\\~97.56% to lose, \\~2.44% to get another pill.\n\nTo win, you have to land on another pill option until you get every pill.\n\nFirst time you land on it, you have 41/41 chance to get a new one, then 40/41 the second time, 39/41 the third, and so on, until 1/41 for the last one.\n\nIn order to get all of them, on average you need 176.42 successes.\n\nThere is a \\~2.44% to succeed, and you need all of them to be in a row.\n\nso we have to calculate (2.44/100)^(176.42) which is equal to 3.18 \\* 10^(-285)\n\nThe chances to get all 42 pills at least once is approximately 1 in 3 \\* 10^(284) or 1 in 30000...(274 entire 0's here)...00000.\n\nI hope this is correct, I read a lot of different answers in this thread, and everyone is an extremely different answer, so my hopes aren't really that high.\n\nEdit: Got the answer very wrong, as I multiplied the step of getting each pill once instead of adding, the correct value is 176.42 not that monstrous 3.97\\*10\\^16 I got. My answer is actually very similar to u/Away-Commercial-4380, so I have high hopes this is the correct answer."}</p>