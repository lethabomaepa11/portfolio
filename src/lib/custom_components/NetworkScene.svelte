<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';

	let { projectCount = 30, skillCount = 20 } = $props();

	let canvas;
	let scene, camera, renderer, raycaster, mouse;
	let nodes = [];
	let edges = [];
	let sphereMeshes = [];
	let edgeLines = [];
	let animationId;
	let clock = new THREE.Clock();
	let hoveredNode = null;
	let cameraIntroDone = false;

	const COLORS = {
		node: 0x6366f1,
		nodeHover: 0x818cf8,
		edge: 0x312e81,
		edgeHighlight: 0x6366f1,
		skill: 0x06b6d4,
		project: 0xf59e0b
	};

	function createNode(radius, color, label) {
		const geometry = new THREE.SphereGeometry(radius, 24, 24);
		const material = new THREE.MeshPhysicalMaterial({
			color,
			metalness: 0.3,
			roughness: 0.4,
			emissive: color,
			emissiveIntensity: 0.15
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.userData = { label, baseColor: color, baseRadius: radius };
		return mesh;
	}

	function buildGraph() {
		const total = projectCount + skillCount;

		for (let i = 0; i < total; i++) {
			const isProject = i < projectCount;
			const color = isProject ? COLORS.project : COLORS.skill;
			const radius = isProject ? 0.25 + Math.random() * 0.15 : 0.18 + Math.random() * 0.1;
			const label = isProject ? `project-${i}` : `skill-${i}`;
			const mesh = createNode(radius, color, label);

			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			const r = 3 + Math.random() * 4;
			mesh.position.set(
				r * Math.sin(phi) * Math.cos(theta),
				r * Math.sin(phi) * Math.sin(theta),
				r * Math.cos(phi)
			);

			scene.add(mesh);
			sphereMeshes.push(mesh);
			nodes.push({
				mesh,
				velocity: new THREE.Vector3(
					(Math.random() - 0.5) * 0.01,
					(Math.random() - 0.5) * 0.01,
					(Math.random() - 0.5) * 0.01
				),
				isProject
			});
		}

		for (let i = 0; i < total * 1.5; i++) {
			const a = Math.floor(Math.random() * total);
			const b = Math.floor(Math.random() * total);
			if (a === b) continue;

			const posA = sphereMeshes[a].position;
			const posB = sphereMeshes[b].position;

			const geometry = new THREE.BufferGeometry().setFromPoints([posA, posB]);
			const material = new THREE.LineBasicMaterial({
				color: COLORS.edge,
				transparent: true,
				opacity: 0.15 + Math.random() * 0.2
			});
			const line = new THREE.Line(geometry, material);
			scene.add(line);
			edgeLines.push({ line, a, b });
		}
	}

	function animate() {
		animationId = requestAnimationFrame(animate);
		const delta = clock.getDelta();

		for (const edge of edgeLines) {
			const posA = sphereMeshes[edge.a].position;
			const posB = sphereMeshes[edge.b].position;
			const positions = edge.line.geometry.attributes.position.array;
			positions[0] = posA.x;
			positions[1] = posA.y;
			positions[2] = posA.z;
			positions[3] = posB.x;
			positions[4] = posB.y;
			positions[5] = posB.z;
			edge.line.geometry.attributes.position.needsUpdate = true;
		}

		for (const node of nodes) {
			node.mesh.position.x += node.velocity.x * delta * 2;
			node.mesh.position.y += node.velocity.y * delta * 2;
			node.mesh.position.z += node.velocity.z * delta * 2;
		}

		const time = clock.elapsedTime;
		for (let i = 0; i < sphereMeshes.length; i++) {
			const mesh = sphereMeshes[i];
			const phase = i * 0.3;
			const float = Math.sin(time * 0.3 + phase) * 0.002;
			mesh.position.y += float * delta * 10;
		}

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(sphereMeshes);

		if (intersects.length > 0) {
			const hit = intersects[0].object;
			if (hoveredNode !== hit) {
				if (hoveredNode) {
					gsap.to(hoveredNode.material, {
						emissiveIntensity: 0.15,
						duration: 0.3
					});
					gsap.to(hoveredNode.scale, {
						x: 1,
						y: 1,
						z: 1,
						duration: 0.3
					});
				}
				hoveredNode = hit;
				gsap.to(hit.material, {
					emissiveIntensity: 0.6,
					duration: 0.3
				});
				gsap.to(hit.scale, {
					x: 1.8,
					y: 1.8,
					z: 1.8,
					duration: 0.3,
					ease: 'back.out(2)'
				});

				for (const edge of edgeLines) {
					const isConnected = edge.a === sphereMeshes.indexOf(hit) || edge.b === sphereMeshes.indexOf(hit);
					gsap.to(edge.line.material, {
						opacity: isConnected ? 0.6 : 0.05,
						duration: 0.3
					});
					if (isConnected) {
						gsap.to(edge.line.material.color, {
							r: 0.39,
							g: 0.55,
							b: 0.95,
							duration: 0.3
						});
					} else {
						gsap.to(edge.line.material.color, {
							r: 0.19,
							g: 0.18,
							b: 0.51,
							duration: 0.3
						});
					}
				}
			}
		} else if (hoveredNode) {
			gsap.to(hoveredNode.material, {
				emissiveIntensity: 0.15,
				duration: 0.3
			});
			gsap.to(hoveredNode.scale, {
				x: 1,
				y: 1,
				z: 1,
				duration: 0.3
			});
			for (const edge of edgeLines) {
				gsap.to(edge.line.material, {
					opacity: 0.15 + Math.random() * 0.2,
					duration: 0.3
				});
				gsap.to(edge.line.material.color, {
					r: 0.19,
					g: 0.18,
					b: 0.51,
					duration: 0.3
				});
			}
			hoveredNode = null;
		}

		camera.position.x += (camera.userData.targetX - camera.position.x) * 0.02;
		camera.position.y += (camera.userData.targetY - camera.position.y) * 0.02;
		camera.position.z += (camera.userData.targetZ - camera.position.z) * 0.02;
		camera.lookAt(0, 0, 0);
		renderer.render(scene, camera);
	}

	function handleResize() {
		if (!canvas) return;
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}

	function handleMouseMove(event) {
		const rect = canvas.getBoundingClientRect();
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		const followX = (mouse.x * 2) * 0.8;
		const followY = (mouse.y * 2) * 0.5;
		camera.userData.targetX = followX;
		camera.userData.targetY = followY;
	}

	onMount(() => {
		if (!browser) return;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x0a0a1a);

		camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 50);
		camera.position.set(0, 0, 10);
		camera.userData = { targetX: 0, targetY: 0, targetZ: 10 };

		renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			alpha: true
		});
		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
		scene.add(ambientLight);

		const dirLight = new THREE.DirectionalLight(0x818cf8, 1.5);
		dirLight.position.set(5, 5, 5);
		scene.add(dirLight);

		const pointLight = new THREE.PointLight(0x6366f1, 6, 15);
		pointLight.position.set(-3, 2, -3);
		scene.add(pointLight);

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		buildGraph();

		gsap.to(camera.position, {
			x: 1.5,
			y: 1,
			z: 8,
			duration: 2,
			ease: 'power3.out',
			onComplete: () => {
				cameraIntroDone = true;
				gsap.to(camera.position, {
					x: 0,
					y: 0,
					z: 7,
					duration: 4,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
			}
		});

		window.addEventListener('resize', handleResize);
		canvas.addEventListener('mousemove', handleMouseMove);

		animate();

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);
			canvas?.removeEventListener('mousemove', handleMouseMove);
			renderer?.dispose();
			scene?.clear();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 -z-10 h-full w-full opacity-60"
	aria-hidden="true"
></canvas>
