参考：https://qiita.com/Motonosuke/items/89602405937edea8fa7a
# Django側設定
### dbコンテナ立ち上げ
`docker-compose up -d db`

### その他のコンテナ立ち上げ＋build
`docker-compose up -d --build`

### Djangoプロジェクト作成
`docker-compose run web django-admin.py startproject backend .`
末尾の" ."も忘れずに

### settings.pyをmysqlに編集する
`DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tasklogger',
        'USER': 'admin',
        'PASSWORD': 'password',
        'HOST': 'db',   
        'PORT': '3306',
    }
}
`

### マイグレーション
`docker-compose run web ./manage.py migrate`

### スーパーユーザ作成
`docker-compose run web ./manage.py createsuperuser`

### 全てのコンテナを立ち上げる
`docker-compose up -d`

### Djangoアプリ作成
`docker-compose run web ./manage.py startapp api`
