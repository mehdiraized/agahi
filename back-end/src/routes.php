<?php
// Routes
$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->get('/posts/', function ($request, $response) {
    return $response->getBody()->write(Posts::join('category', 'posts.catid', '=', 'category.id')
        ->select('posts.id', 'title', 'content', 'price', 'created_at', 'pic', 'category.name as category', 'author_id')->orderBy('id', 'DESC')->get()->toJson());
});
$app->get('/cats/', function ($request, $response) {
    return $response->getBody()->write(Cats::all()->toJson());
});

$app->get('/posts/{id}/', function ($request, $response, $args) {
    $id = $args['id'];
    $dev = Posts::find($id);
    $response->getBody()->write($dev->toJson());
    return $response;
});

$app->get('/category/{id}/', function ($request, $response, $args) {
    $id = $args['id'];
    return $response->getBody()->write(Posts::join('category', 'posts.catid', '=', 'category.id')
        ->select('posts.id', 'title', 'content', 'price', 'created_at', 'pic', 'category.name as category', 'author_id')->where('category.id', $id)->orderBy('id', 'DESC')->get()->toJson());
});

$app->post('/posts/', function ($request, $response, $args) {
    $data = $request->getParsedBody();
    $dev = new Posts();
    $dev->title = $data['title'];
    $dev->content = $data['content'];
    $dev->catid = $data['catid'];
    $dev->price = $data['price'];
    $dev->author_id = $data['author_id'];
        $images_path = __DIR__."/../../test/assets/img/upload/";
        
    if (!is_dir($images_path)) {
        mkdir($images_path, 0777, true);
    }
    $this->logger->debug('Path = ' .$images_path);
    $files = $request->getUploadedFiles();
    if ($files) {
        $keys = array_keys($files);
        foreach ($keys as $key) {
            $file = $files[$key];
            if (!isset($file)) {
                $message['status']="error";
                $message['msg']="Encountered an error: while uploading.no FILE UPLOADED";
                return $response->withStatus(400)->getBody()->write($message);
            } else {
                $imgs=array();

                if ($file->getError()==0) {
                    $name = $file->getClientFilename();

                    //make sure you have a folder called uploads where this php file is
                    if (!is_dir($images_path)) {
                        mkdir($images_path, 0777, true);
                    }
                    try {
                        $file-> moveTo($images_path."/".$name);
                        $dev->pic = "assets/img/upload/".$name;
                    } catch (Exception $e) {
                        $message['status']="error";
                        $message['msg']="Encountered an error: while uploading. NO FILE UPLOADED";
                        return $response->withStatus(400)->getBody()->write($message);
                    }
                }
            }
        }
    } else {
        $dev->pic = '';
    }
    $dev->save();

    return $response->withStatus(201)->getBody()->write($dev->toJson());
});


$app->delete('/posts/{id}/', function ($request, $response, $args) {
    $id = $args['id'];
    $dev = Posts::find($id);
    $dev->delete();

    return $response->withStatus(200);
});

$app->post('/posts/{id}/', function ($request, $response, $args) {
    $id = $args['id'];
        $data = $request->getParsedBody();
        
    $dev = Posts::find($id);
    $dev->title =  $data['title'] ?: $dev->title;
    $dev->content = $data['content'] ?: $dev->content;
    $dev->catid = $data['catid'] ?: $dev->catid;
    $dev->price = $data['price'] ?: $dev->price;
    $dev->author_id = $data['author_id'] ?: $dev->author_id;
    $images_path = __DIR__."/../../test/assets/img/upload/";

    if (!is_dir($images_path)) {
                mkdir($images_path, 0777, true);
    }
        $this->logger->debug('Path = ' .$images_path);
        $files = $request->getUploadedFiles();
    if ($files) {
        $keys = array_keys($files);
        foreach ($keys as $key) {
            $file = $files[$key];
            if (!isset($file)) {
                $message['status']="error";
                $message['msg']="Encountered an error: while uploading.no FILE UPLOADED";
                return $response->withStatus(400)->getBody()->write($message);
            } else {
                $imgs=array();

                if ($file->getError()==0) {
                    $name = $file->getClientFilename();

                    //make sure you have a folder called uploads where this php file is
                    if (!is_dir($images_path)) {
                        mkdir($images_path, 0777, true);
                    }
                    try {
                        $file->moveTo($images_path."/".$name);
                        $dev->pic = "assets/img/upload/".$name;
                    } catch (Exception $e) {
                        $message['status']="error";
                        $message['msg']="Encountered an error: while uploading. NO FILE UPLOADED";
                        return $response->withStatus(400)->getBody()->write($message);
                    }
                }
            }
        }
    } else {
        $dev->pic = '';
    }
    $dev->save();

    return $response->getBody()->write($dev->toJson());
});


$app->post('/user/', function ($request, $response, $args) {
    $data = $request->getParsedBody();
    //var_dump($data);
    //$dev->username = $data['username'];
    //$dev->password = $data['password'];

    $dev = User::where('user', $data['username'])->where('pass', $data['password'])->get();
    $response->write($dev->toJson());
    return $response;
});
