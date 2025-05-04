<script>
	let { image } = $props();
</script>

<!-- component -->
<div class="w-[608px] [perspective:1500px]">
	<div
		class="relative h-[420px] w-full origin-bottom [transform-style:preserve-3d] [transform:rotateX(73deg)]"
	>
		<div
			class="absolute -top-[343px] left-0 aspect-video h-[342px] origin-bottom overflow-hidden rounded-md border-[2px] border-[#404041] bg-black [transform:rotateX(-70deg)]"
		>
			<div
				class="absolute bottom-0 left-0 flex h-3 w-full items-center justify-center bg-zinc-900 text-[6px] font-thin text-zinc-200"
			>
				MacBook Air
			</div>
			<div class="absolute inset-1 mx-1 mb-4 mt-1 overflow-hidden rounded-[3px]">
				<div
					class="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-900/10"
				>
					<img src={image} alt={image} class="h-full w-full" />
					<div
						class="absolute left-1/2 top-1/2 h-12 w-48 -translate-x-1/2 -translate-y-1/2 bg-slate-500 blur-[80px]"
					></div>
				</div>
			</div>
		</div>
		<div
			class="hidden h-[420px] w-[608px] flex-col items-start overflow-hidden rounded-[16px] border-b border-zinc-800 bg-[#6F7072] pb-3 lg:flex"
		>
			<div class="absolute inset-0 -z-10 mt-3 h-full w-full rounded-[28px] bg-[#646464]"></div>
			<div
				class="absolute bottom-[8px] left-[241px] -mb-4 h-[8px] w-[126px] rounded-t-full bg-zinc-700/50 [transform:rotateX(210deg)]"
			></div>
			<div class="relative h-[6.94%] w-full">
				<div class="absolute left-1/2 top-0 flex h-2 w-[75%] -translate-x-1/2 items-center">
					<div
						class="h-full w-[10%] rounded-bl-sm bg-gradient-to-b from-black via-neutral-700 to-black"
					></div>
					<div class="h-full flex-grow bg-gradient-to-b from-black via-black to-zinc-700"></div>
					<div
						class="h-full w-[10%] rounded-br-sm bg-gradient-to-b from-black via-neutral-700 to-black"
					></div>
				</div>
			</div>
			<div class="relative hidden h-[50.42%] w-full lg:flex">
				<div
					class="mx-[2px] my-[6px] w-[4.07%]"
					style="background-image: url('data:image/svg+xml,\
                    <svg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'>\
                    <circle cx=\'2\' cy=\'2\' r=\'0.8\' fill=\'rgba(0, 0, 0, 0.2)\'/>\
                    </svg>');
                    background-repeat: repeat;
                    background-size: 3px 3px;"
				></div>
				<div
					class="relative flex w-[91.86%] flex-col overflow-hidden rounded-md border border-neutral-600/60 border-opacity-70 p-[5px]"
				>
					<div
						class="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-r from-neutral-600/20 via-neutral-800/10 to-transparent"
					></div>
					<div
						class="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-l from-neutral-600/20 via-neutral-800/10 to-transparent"
					></div>
					<div
						class="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-t from-neutral-600/20 via-neutral-800/10 to-transparent"
					></div>

					<!-- Function keys row -->
					<div class="mb-[.6%] flex h-[10.03%] w-full items-center gap-x-[3px]">
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							esc
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F1
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F2
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F3
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F4
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F5
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F6
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F7
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F8
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F9
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F10
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F11
						</div>
						<div
							class="flex h-full flex-1 items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							F12
						</div>
						<div
							class="aspect-square h-full rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						></div>
					</div>

					<!-- Number row -->
					<div class="mb-[.6%] flex h-[16.62%] w-full items-center space-x-[2px]">
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>~</div>
							<div>`</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>!</div>
							<div>1</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>@</div>
							<div>2</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>#</div>
							<div>3</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>$</div>
							<div>4</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>%</div>
							<div>5</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>^</div>
							<div>6</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>&</div>
							<div>7</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>*</div>
							<div>8</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>(</div>
							<div>9</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>)</div>
							<div>0</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>_</div>
							<div>-</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>+</div>
							<div>=</div>
						</div>
						<div
							class="flex h-full flex-[1.3] items-end justify-end rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							delete
						</div>
					</div>
					<!-- QWERTY row -->
					<div class="mb-[.6%] flex h-[16.62%] w-full items-center space-x-[2px]">
						<div
							class="flex h-full flex-[1.31] items-end justify-start rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							tab
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>Q</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>W</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>E</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>R</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>T</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>Y</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>U</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>I</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>O</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>P</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>{'{'}</div>
							<div>[</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>{'}'}</div>
							<div>]</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>|</div>
							<div>\</div>
						</div>
					</div>
					<!-- ASDF row -->
					<div class="mb-[.6%] flex h-[16.62%] w-full items-center space-x-[2px]">
						<div
							class="flex h-full flex-[1.5] items-end justify-start rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							caps lock
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>A</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>S</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>D</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>F</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>G</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>H</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>J</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>K</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>L</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>:</div>
							<div>;</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>"</div>
							<div>'</div>
						</div>
						<div
							class="flex h-full flex-[1.55] items-end justify-end rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							return
						</div>
					</div>
					<!-- ZXCV row -->
					<div class="mb-[.5%] flex h-[16.62%] w-full items-center space-x-[2px]">
						<div
							class="flex h-full flex-[2] items-end justify-start rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							shift
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>Z</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>X</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>C</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>V</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>B</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>N</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div></div>
							<div>M</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>&lt;</div>
							<div>,</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>&gt;</div>
							<div>.</div>
						</div>
						<div
							class="flex h-full flex-1 flex-col items-center justify-center rounded-[4px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div>?</div>
							<div>/</div>
						</div>
						<div
							class="flex h-full flex-[2] items-end justify-end rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							shift
						</div>
					</div>
					<!-- Bottom row -->
					<div class="flex h-[16.62%] w-full items-end space-x-[2px]">
						<div
							class="relative flex h-full flex-[1.2] flex-col items-center justify-center rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div class="absolute right-[6px] top-1">fn</div>
							<div class="absolute bottom-1 left-1">
								<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										fill-rule="evenodd"
										d="M12 21.237a9.237 9.237 0 1 0 0-18.474a9.237 9.237 0 0 0 0 18.474m2.99-16.971c.36.387.685.838.97 1.335c.523.905.931 1.99 1.195 3.19q.623.156 1.166.348c.668.237 1.255.517 1.72.84a8.31 8.31 0 0 0-5.051-5.713m5.171 9.196c-.483.359-1.113.668-1.84.925q-.498.176-1.066.322c-.254 1.4-.7 2.66-1.294 3.69a7.4 7.4 0 0 1-.971 1.335a8.3 8.3 0 0 0 5.171-6.272m-11.15 6.272a7.4 7.4 0 0 1-.972-1.335c-.593-1.03-1.04-2.29-1.294-3.69a13 13 0 0 1-1.066-.322c-.727-.257-1.357-.566-1.84-.925a8.3 8.3 0 0 0 5.171 6.272M3.958 9.978c.465-.322 1.052-.602 1.72-.839q.543-.191 1.166-.348c.264-1.2.672-2.285 1.194-3.19a7.4 7.4 0 0 1 .971-1.335A8.31 8.31 0 0 0 3.96 9.978m11.18-3.905c.409.71.746 1.554.989 2.496a22.5 22.5 0 0 0-3.655-.354v-4.41c.978.19 1.918.97 2.666 2.268m1.204 3.504a21 21 0 0 0-3.87-.415v5.202c1.447-.028 2.792-.183 3.945-.43q.127-.932.128-1.934c0-.845-.071-1.658-.203-2.423m-4.818-5.773v4.41a22.5 22.5 0 0 0-3.654.355c.242-.942.58-1.787.988-2.496c.748-1.297 1.688-2.078 2.666-2.269m0 5.358a21 21 0 0 0-3.87.415A14.3 14.3 0 0 0 7.453 12c0 .667.044 1.314.128 1.933c1.153.248 2.498.403 3.945.43zm-5.531.87q.315-.11.663-.21a15.5 15.5 0 0 0-.062 3.865q-.315-.093-.601-.193c-.76-.269-1.34-.577-1.722-.896c-.385-.321-.515-.605-.515-.835s.13-.514.515-.835c.382-.319.962-.627 1.722-.895m2.865 7.895c-.479-.832-.86-1.85-1.105-2.992c1.138.219 2.418.351 3.771.376v4.885c-.978-.191-1.918-.972-2.666-2.27m3.614 2.269V15.31a22.4 22.4 0 0 0 3.771-.376c-.244 1.143-.626 2.16-1.105 2.992c-.748 1.297-1.688 2.078-2.666 2.269M17.494 12q0 .864-.09 1.687q.315-.092.601-.193c.76-.269 1.34-.577 1.722-.896c.385-.321.515-.605.515-.835s-.13-.514-.515-.835c-.382-.319-.962-.627-1.722-.895q-.315-.111-.663-.211c.1.7.153 1.429.153 2.178"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						</div>
						<div
							class="relative flex h-full flex-[1] items-end justify-center rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div class="absolute right-1 top-1">⌃</div>
							<div>control</div>
						</div>
						<div
							class="relative flex h-full flex-[1] items-end justify-center rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div class="absolute right-1 top-[1px]">⌥</div>
							<div>option</div>
						</div>
						<div
							class="relative flex h-full flex-[.8] items-end justify-center rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div class="absolute right-1 top-[1px]">⌘</div>
							<div>command</div>
						</div>
						<div
							class="h-full flex-[7] rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						></div>
						<div
							class="relative flex h-full flex-[1] items-end rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div class="absolute left-1 top-[1px]">⌘</div>
							<div>command</div>
						</div>
						<div
							class="relative flex h-full flex-[.8] items-end justify-center rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 p-1 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div class="absolute left-1 top-[1px]">⌥</div>
							<div>option</div>
						</div>
						<div
							class="flex h-1/2 flex-[1.4] items-center justify-center rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<svg class="rotate-180" width="8" height="5" viewBox="0 0 8 8">
								<polygon points="8,4 4,0 4,8" fill="currentColor" />
							</svg>
						</div>
						<div
							class="flex h-full flex-[1.4] flex-col gap-[1px] rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<div
								class="flex flex-1 items-center justify-center rounded-t-[3px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
							>
								<svg width="8" height="5" viewBox="0 0 8 8">
									<polygon points="4,0 0,4 8,4" fill="currentColor" />
								</svg>
							</div>
							<div
								class="flex flex-1 items-center justify-center rounded-b-[3px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
							>
								<svg width="8" height="5" viewBox="0 0 8 8">
									<polygon points="4,8 0,4 8,4" fill="currentColor" />
								</svg>
							</div>
						</div>
						<div
							class="flex h-1/2 flex-[1.4] items-center justify-center rounded-[3px] bg-gradient-to-t from-black via-black to-zinc-900 text-[8px] text-neutral-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.3)]"
						>
							<svg class="rotate-180" width="8" height="5" viewBox="0 0 8 8">
								<polygon points="0,4 4,0 4,8" fill="currentColor" />
							</svg>
						</div>
					</div>
				</div>
				<div
					class="mx-[2px] my-[6px] w-[4.07%]"
					style="background-image: url('data:image/svg+xml,\
                    <svg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'>\
                    <circle cx=\'2\' cy=\'2\' r=\'0.8\' fill=\'rgba(0, 0, 0, 0.2)\'/>\
                    </svg>');
                    background-repeat: repeat;
                    background-size: 3px 3px;"
				></div>
			</div>
			<div class="relative flex h-[42.64%] w-full flex-col items-center">
				<div
					class="border- my-auto h-[91.56%] w-[40.41%] rounded-md border border-b-2 border-neutral-600/60 border-opacity-70"
				></div>
			</div>
		</div>
	</div>
</div>
