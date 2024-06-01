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

<div class="dropdown">
	<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
	  Dropdown form
	</button>
	<form class="dropdown-menu p-4">
	  <div class="mb-3">
		<label for="exampleDropdownFormEmail2" class="form-label">Email address</label>
		<input type="email" class="form-control" id="exampleDropdownFormEmail2" placeholder="email@example.com">
	  </div>
	  <div class="mb-3">
		<label for="exampleDropdownFormPassword2" class="form-label">Password</label>
		<input type="password" class="form-control" id="exampleDropdownFormPassword2" placeholder="Password">
	  </div>
	  <div class="mb-3">
		<div class="form-check">
		  <input type="checkbox" class="form-check-input" id="dropdownCheck2">
		  <label class="form-check-label" for="dropdownCheck2">
			Remember me
		  </label>
		</div>
	  </div>
	  <button type="submit" class="btn btn-primary">Sign in</button>
	</form>
  </div>

<p>{"2nd Edit: just read u/Away-Commercial-4380 comment [here](https://www.reddit.com/r/theydidthemath/comments/1ctay7r/comment/l4aqgv8/?utm_source=share&amp;utm_medium=web3x&amp;utm_name=web3xcss&amp;utm_term=1&amp;utm_content=share_button). I got it slightly wrong.\n\nThere are 42 pills\n\nThere are 3 possibilities:\n\n1. No black pill\n2. Black pill + another pill\n3. Two black pills\n\nFirst one makes you \"lose\", second one makes you progress if the other pill is a new one, and the third one gives you a second life essentially, so next time you'd have lost you don't.\n\nEvery round you have \\~95.3% chance of losing, a \\~2.38% chance of another pill, and \\~2.38% chance of gaining another life.\n\nGaining a new life can be summarised as increasing both the chance to lose as well as win. It increases chance to lose by \\~2.32%, and chance of another pill by 0.06%, so we can simplify each round as:\n\n\\~97.56% to lose, \\~2.44% to get another pill.\n\nTo win, you have to land on another pill option until you get every pill.\n\nFirst time you land on it, you have 41/41 chance to get a new one, then 40/41 the second time, 39/41 the third, and so on, until 1/41 for the last one.\n\nIn order to get all of them, on average you need 176.42 successes.\n\nThere is a \\~2.44% to succeed, and you need all of them to be in a row.\n\nso we have to calculate (2.44/100)^(176.42) which is equal to 3.18 \\* 10^(-285)\n\nThe chances to get all 42 pills at least once is approximately 1 in 3 \\* 10^(284) or 1 in 30000...(274 entire 0's here)...00000.\n\nI hope this is correct, I read a lot of different answers in this thread, and everyone is an extremely different answer, so my hopes aren't really that high.\n\nEdit: Got the answer very wrong, as I multiplied the step of getting each pill once instead of adding, the correct value is 176.42 not that monstrous 3.97\\*10\\^16 I got. My answer is actually very similar to u/Away-Commercial-4380, so I have high hopes this is the correct answer."}</p>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reddit" viewBox="0 0 16 16">
	<path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z"/>
	<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165"/>
  </svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="_1O4jTk-dZ-VIxsCuYB6OR8" viewBox="0 0 216 216">
    <defs>
        <radialGradient id="snoo-radial-gragient" cx="169.75" cy="92.19" r="50.98" fx="169.75" fy="92.19" gradientTransform="matrix(1 0 0 .87 0 11.64)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#feffff"/>
            <stop offset=".4" stop-color="#feffff"/>
            <stop offset=".51" stop-color="#f9fcfc"/>
            <stop offset=".62" stop-color="#edf3f5"/>
            <stop offset=".7" stop-color="#dee9ec"/>
            <stop offset=".72" stop-color="#d8e4e8"/>
            <stop offset=".76" stop-color="#ccd8df"/>
            <stop offset=".8" stop-color="#c8d5dd"/>
            <stop offset=".83" stop-color="#ccd6de"/>
            <stop offset=".85" stop-color="#d8dbe2"/>
            <stop offset=".88" stop-color="#ede3e9"/>
            <stop offset=".9" stop-color="#ffebef"/>
        </radialGradient>
        <radialGradient xlink:href="#snoo-radial-gragient" id="snoo-radial-gragient-2" cx="47.31" r="50.98" fx="47.31"/>
        <radialGradient xlink:href="#snoo-radial-gragient" id="snoo-radial-gragient-3" cx="109.61" cy="85.59" r="153.78" fx="109.61" fy="85.59" gradientTransform="matrix(1 0 0 .7 0 25.56)"/>
        <radialGradient id="snoo-radial-gragient-4" cx="-6.01" cy="64.68" r="12.85" fx="-6.01" fy="64.68" gradientTransform="matrix(1.07 0 0 1.55 81.08 27.26)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#f60"/>
            <stop offset=".5" stop-color="#ff4500"/>
            <stop offset=".7" stop-color="#fc4301"/>
            <stop offset=".82" stop-color="#f43f07"/>
            <stop offset=".92" stop-color="#e53812"/>
            <stop offset="1" stop-color="#d4301f"/>
        </radialGradient>
        <radialGradient xlink:href="#snoo-radial-gragient-4" id="snoo-radial-gragient-5" cx="-73.55" cy="64.68" r="12.85" fx="-73.55" fy="64.68" gradientTransform="matrix(-1.07 0 0 1.55 62.87 27.26)"/>
        <radialGradient id="snoo-radial-gragient-6" cx="107.93" cy="166.96" r="45.3" fx="107.93" fy="166.96" gradientTransform="matrix(1 0 0 .66 0 57.4)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#172e35"/>
            <stop offset=".29" stop-color="#0e1c21"/>
            <stop offset=".73" stop-color="#030708"/>
            <stop offset="1"/>
        </radialGradient>
        <radialGradient xlink:href="#snoo-radial-gragient" id="snoo-radial-gragient-7" cx="147.88" cy="32.94" r="39.77" fx="147.88" fy="32.94" gradientTransform="matrix(1 0 0 .98 0 .54)"/>
        <radialGradient id="snoo-radial-gragient-8" cx="131.31" cy="73.08" r="32.6" fx="131.31" fy="73.08" gradientUnits="userSpaceOnUse">
            <stop offset=".48" stop-color="#7a9299"/>
            <stop offset=".67" stop-color="#172e35"/>
            <stop offset=".75"/>
            <stop offset=".82" stop-color="#172e35"/>
        </radialGradient>
        <style>
            .snoo-cls-11{stroke-width:0;fill:#ffc49c}
        </style>
    </defs>
    <path fill="#ff4500" stroke-width="0" d="M108 0C48.35 0 0 48.35 0 108c0 29.82 12.09 56.82 31.63 76.37l-20.57 20.57C6.98 209.02 9.87 216 15.64 216H108c59.65 0 108-48.35 108-108S167.65 0 108 0Z"/>
    <circle cx="169.22" cy="106.98" r="25.22" fill="url(#snoo-radial-gragient)" stroke-width="0"/>
    <circle cx="46.78" cy="106.98" r="25.22" fill="url(#snoo-radial-gragient-2)" stroke-width="0"/>
    <ellipse cx="108.06" cy="128.64" fill="url(#snoo-radial-gragient-3)" stroke-width="0" rx="72" ry="54"/>
    <path fill="url(#snoo-radial-gragient-4)" stroke-width="0" d="M86.78 123.48c-.42 9.08-6.49 12.38-13.56 12.38s-12.46-4.93-12.04-14.01c.42-9.08 6.49-15.02 13.56-15.02s12.46 7.58 12.04 16.66Z"/>
    <path fill="url(#snoo-radial-gragient-5)" stroke-width="0" d="M129.35 123.48c.42 9.08 6.49 12.38 13.56 12.38s12.46-4.93 12.04-14.01c-.42-9.08-6.49-15.02-13.56-15.02s-12.46 7.58-12.04 16.66Z"/>
    <ellipse cx="79.63" cy="116.37" class="snoo-cls-11" rx="2.8" ry="3.05"/>
    <ellipse cx="146.21" cy="116.37" class="snoo-cls-11" rx="2.8" ry="3.05"/>
    <path fill="url(#snoo-radial-gragient-6)" stroke-width="0" d="M108.06 142.92c-8.76 0-17.16.43-24.92 1.22-1.33.13-2.17 1.51-1.65 2.74 4.35 10.39 14.61 17.69 26.57 17.69s22.23-7.3 26.57-17.69c.52-1.23-.33-2.61-1.65-2.74-7.77-.79-16.16-1.22-24.92-1.22Z"/>
    <circle cx="147.49" cy="49.43" r="17.87" fill="url(#snoo-radial-gragient-7)" stroke-width="0"/>
    <path fill="url(#snoo-radial-gragient-8)" stroke-width="0" d="M107.8 76.92c-2.14 0-3.87-.89-3.87-2.27 0-16.01 13.03-29.04 29.04-29.04 2.14 0 3.87 1.73 3.87 3.87s-1.73 3.87-3.87 3.87c-11.74 0-21.29 9.55-21.29 21.29 0 1.38-1.73 2.27-3.87 2.27Z"/>
    <path fill="#842123" stroke-width="0" d="M62.82 122.65c.39-8.56 6.08-14.16 12.69-14.16 6.26 0 11.1 6.39 11.28 14.33.17-8.88-5.13-15.99-12.05-15.99s-13.14 6.05-13.56 15.2c-.42 9.15 4.97 13.83 12.04 13.83h.52c-6.44-.16-11.3-4.79-10.91-13.2Zm90.48 0c-.39-8.56-6.08-14.16-12.69-14.16-6.26 0-11.1 6.39-11.28 14.33-.17-8.88 5.13-15.99 12.05-15.99 7.07 0 13.14 6.05 13.56 15.2.42 9.15-4.97 13.83-12.04 13.83h-.52c6.44-.16 11.3-4.79 10.91-13.2Z"/>
</svg>