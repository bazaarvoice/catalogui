# Makefile for deploying to Bosun

.DEFAULT_GOAL := qa
CHART := bv-stable/bosun-simple-app
NAMESPACE := systemsintegrationteam
APP_NAME := catalogui
AWS_ACCOUNT_ID := 549050352176
TAG := v0.0.1

ifndef GITHUB_TOKEN
$(error GITHUB_TOKEN Environment Variable is not set. Please generate and set one: https://github.com/settings/tokens)
endif


setup:
	@helm repo add bv-stable "https://${GITHUB_TOKEN}@raw.githubusercontent.com/bazaarvoice/charts/master/repo/stable"
	@helm repo update

qa-delete:
	@kubectx qa-eu-a
	-helm delete --namespace $(NAMESPACE) $(APP_NAME)

prod-delete:
	@kubectx prod-us-a
	-helm delete --namespace $(NAMESPACE) $(APP_NAME)

list: 
	@kubectl cluster-info | grep master
	helm list --namespace $(NAMESPACE)

build-qa: check-tag
	@echo "✅ Building a new 🐳 image for '$(APP_NAME)'"
	$(call build-and-push,qa,$(APP_NAME),./dockerfile)

build-prod: check-tag
	@echo "✅ Building a new 🐳 image for '$(APP_NAME)'"
	$(call build-and-push,prod,$(APP_NAME),./dockerfile)

deploy-qa: check-tag
	@kubectx qa-eu-a
	$(call replace-tag-in-file,qa)
	$(call deploy,qa,$(APP_NAME))
	$(call replace-tag-in-file-reverse,qa)

deploy-prod: check-tag
	@kubectx prod-us-a
	$(call replace-tag-in-file,prod)
	$(call deploy,prod,$(APP_NAME))
	$(call replace-tag-in-file-reverse,prod)


build-and-deploy-qa: $(check-tag) setup build-qa deploy-qa
build-and-deploy-backend-qa: $(check-tag) setup build-backend-qa deploy-backend-qa

build-and-deploy-prod: $(check-tag) setup build-prod deploy-prod
build-and-deploy-backend-prod: $(check-tag) setup build-backend-prod deploy-backend-prod


check-tag:
ifndef TAG
	$(error TAG is not defined)
endif

define build-and-push
	$(if $(filter $(1), prod), $(eval AWS_ACCOUNT_ID := 468552248569))
	aws ecr get-login-password --region us-east-1 --profile $(1) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com
	DOCKER_BUILDKIT=1 docker build . -f $(3) --ssh default -t $(AWS_ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com/$(2):$(TAG)
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com/$(2):$(TAG)
endef

define deploy
	helm upgrade --wait --install --namespace $(NAMESPACE) -f ./deploy/bosun-$(1).yaml $(2) $(CHART)
endef

define replace-tag-in-file
	sed -i '' 's/TAG_PLACEHOLDER/${TAG}/g' ./deploy/bosun-$(1).yaml
endef

define replace-tag-in-file-reverse
	sed -i '' 's/${TAG}/TAG_PLACEHOLDER/g' ./deploy/bosun-$(1).yaml
endef
