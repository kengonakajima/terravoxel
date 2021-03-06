s=document.createElement('script');  s.src="//rawgit.com/mrdoob/three.js/master/examples/js/libs/stats.min.js";         document.head.appendChild(s); s.onload=function(){
s=document.createElement('script');  s.src="//rawgit.com/mrdoob/three.js/master/examples/js/libs/dat.gui.min.js";       document.head.appendChild(s); s.onload=function(){
s=document.createElement('script');  s.src="//rawgit.com/mrdoob/three.js/master/build/three.js";                        document.head.appendChild(s); s.onload=function(){
s=document.createElement('script');  s.src="//rawgit.com/mrdoob/three.js/master/examples/js/controls/FlyControls.js";   document.head.appendChild(s); s.onload=function(){
s=document.createElement('script');  s.src="//rawgit.com/mrdoob/three.js/master/examples/js/controls/OrbitControls.js"; document.head.appendChild(s); s.onload=function(){
img1=document.createElement('img'); img1.src="c1e.jpg"; img1.onload=function() {
img2=document.createElement('img'); img2.src="c1.jpg";  img2.onload=function() {
    clock    = new THREE.Clock();
    var instrow = 32, instances = instrow*instrow, ovr=2.5,hei=4;
    container=document.createElement('div');
    document.body.appendChild(container);
    stats    = new Stats();
    container.appendChild( stats.dom );
    scene  = new THREE.Scene();
    panel = stats.addPanel( new Stats.Panel( 'tri', '#f8f', '#212' ) );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.sortObjects=false;
    renderer.setClearColor( 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    camera   = new THREE.PerspectiveCamera( 20, (window.innerWidth / window.innerHeight), 0.1, 10000 );
    camera.rotation.set(-0.8,0,3);
    camera.position.set(0,0,500);
    camera.updateMatrix(); 
    controls = new THREE.FlyControls(camera,container);
    controls.movementSpeed = img1.width/10;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.rollSpeed = Math.PI / 12;
    controls.autoForward = false;
    controls.dragToLook = true;
    geometry = new THREE.InstancedBufferGeometry();
    vertices = new THREE.BufferAttribute(          new Float32Array([1,1,0,0,1,0,1,0,0,0,0,0,]),3);
    geometry.addAttribute( 'position', vertices );
    ids      = new THREE.InstancedBufferAttribute( new Float32Array( instances ),1,1);
    for(var i=0;i<instances;i++) ids.setX(i,i);
    geometry.addAttribute( 'id', ids );
    geometry.computeBoundingSphere();
    geometry.boundingSphere.radius=instrow;
    geometry.boundingSphere.center.x+=(instrow/2);
    geometry.boundingSphere.center.y+=(instrow/2);
    dx=Math.ceil(img1.width/instrow);
    dy=Math.ceil(img1.height/instrow);
    can=document.createElement('canvas');
    ctx=can.getContext('2d');
    can.width=dx*instrow;
    can.height=dy*instrow; //can.width=can.height=4;ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,4,4);ctx.fillStyle = "#808080"; ctx.fillRect(1,1,2,2);
    ctx.drawImage(img1,0,0,img1.width,img1.height);
    texture1 = new THREE.Texture(can);
    texture1.anisotropy = 0;
    texture1.magFilter = texture1.minFilter = THREE.NearestFilter;
    texture1.needsUpdate=true;
    ctx.drawImage(img2,0,0,img2.width,img2.height);
    texture2 = new THREE.Texture(can);
    texture2.anisotropy = 0;
    texture2.magFilter = texture2.minFilter = THREE.NearestFilter;
    texture2.needsUpdate=true;
    group    = new THREE.Group();
    for(var y=0;y<dy;y++) {
        for(var x=0;x<dx;x++) {
            var u=(x*instrow)*(1./(dx*instrow)),ud=(1./(dx*instrow)),v=(y*instrow)*(1./(dy*instrow)),vd=(1./(dy*instrow));
        }
    }
    vs='precision highp float;uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;uniform sampler2D t1;uniform sampler2D t2;uniform vec4 pos;uniform vec4 w;attribute vec3 position;attribute float id;varying float vid;varying vec3 poi;void main() { vid=id;\
	float y=floor(vid/w.x), x=mod(vid,w.x), u=pos.x+(x*pos.z), v=pos.y+(y*pos.w);vec4 h=texture2D(t1,vec2(u,v));poi=position;\
	gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(x/w.y,y/w.y,((h.x+h.y+h.z))*w.z)+position, 1.0 );}';
    ps='precision highp float;uniform sampler2D t1;uniform sampler2D t2;uniform vec4 pos;uniform vec4 w;varying float vid;varying vec3 poi;void main() {\
float y=floor(vid/w.x), x=mod(vid,w.x), u=pos.x+(x*pos.z), v=pos.y+(y*pos.w);vec4 h=texture2D(t2,vec2(u,v));h.w=floor(poi.x+0.5)*floor(poi.y+0.5);gl_FragColor = h;}';
	material = new THREE.RawShaderMaterial( {
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: {
            t1: { type: "t", value: texture1 } ,
            t2: { type: "t", value: texture2 } ,
            pos : { type: "v4", value: new THREE.Vector4( u, v,ud,vd ) },
            w : { type: "v4",  value: new THREE.Vector4(instrow,ovr,hei,0) }
        },
        vertexShader: vs,fragmentShader: ps
    } );
	mesh     = new THREE.Mesh( geometry, material );
    mesh.position.set((x*(instrow/ovr))-(((instrow/ovr)*dx)/2), (y*(instrow/ovr))-(((instrow/ovr)*dy)/2), 0);
    mesh.updateMatrix();
    group.add( mesh ); 
};
    scene.add(group); 
    onresize=function( event ) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };
    rot=0;
    function animate() {
        var delta = clock.getDelta();
        group.rotation.set(0,0,rot+=delta/300);
        panel.update(renderer.info.render.faces,10000000);
        requestAnimationFrame(animate);
        renderer.render( scene, camera );
        controls.update(delta);
        stats.update();
    }
    animate();
    document.getElementById('progress').style.display='none';
}}}}}}}


/*
  VP

precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform sampler2D t1;
uniform sampler2D t2;
uniform vec4 pos;
uniform vec4 w;
attribute vec3 position;
attribute float id;
varying float vid;
varying vec3 poi;
void main() {
    vid=id;
	float y=floor(vid/w.x), x=mod(vid,w.x), u=pos.x+(x*pos.z), v=pos.y+(y*pos.w);
    vec4 h=texture2D(t1,vec2(u,v));
    poi=position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(x/w.y,y/w.y,((h.x+h.y+h.z))*w.z)+position, 1.0 );
}

PS

precision highp float;
uniform sampler2D t1;
uniform sampler2D t2;
uniform vec4 pos;
uniform vec4 w;
varying float vid;
varying vec3 poi;
void main() {
	float y=floor(vid/w.x), x=mod(vid,w.x), u=pos.x+(x*pos.z), v=pos.y+(y*pos.w);
    vec4 h=texture2D(t2,vec2(u,v));
	h.w=floor(poi.x+0.5)*floor(poi.y+0.5);
	gl_FragColor = h;
}

*/