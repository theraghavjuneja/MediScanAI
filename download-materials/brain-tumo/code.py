import requests


url = "https://storage.googleapis.com/kagglesdsdata/datasets/1608934/2645886/Testing/meningioma/Te-meTr_0003.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20250501%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250501T061454Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=78a0e19f039ea3951cc911fc37d2c19a191d97d4f981235d1b4bceee0b1968581b8a56d7d8434d3684ead1845a955be7c3a09c72e5d02197806d8f5f1c0d6e502b5920fcfb0cf81d1c2f758d7ec5a0e9d65e4e0cbaf85e74558fce92cc0642e6b3b7c40e94cf3eca79e2b7b15c5b8bbd4331ded954a7b6c48a8467d5801fcc4bf0da27801a3ecf9fd74a6678dd22084ba3fcbff045da1121255e1c003e7ca3b34fd1d80fd3384cbc186e2cb8ee519aaf5dfe8ee97cc7ed43a462acafd92aacb882004d7f70d85d05f649f1a722d0d2e5d37b5bcf2313fc570f62b75b5184880a8def9dae27c281c0e605cd2d911bda349c083bf813fc2262195561c2d8a5a31c"
response = requests.get(url)
if response.status_code == 200:
    with open("Te-glTr_0003.jpg", "wb") as f:
        f.write(response.content)
    print("Image downloaded successfully.")
