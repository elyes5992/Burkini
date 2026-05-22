<?php

namespace App\Services;

use FacebookAds\Api;
use FacebookAds\Object\ServerSide\ActionSource;
use FacebookAds\Object\ServerSide\Content;
use FacebookAds\Object\ServerSide\CustomData;
use FacebookAds\Object\ServerSide\Event;
use FacebookAds\Object\ServerSide\EventRequest;
use FacebookAds\Object\ServerSide\UserData;

class MetaPixelService
{
    protected string $pixelId;
    protected string $accessToken;

    public function __construct()
    {
        $this->pixelId = config('services.meta.pixel_id');
        $this->accessToken = config('services.meta.access_token');
        Api::init(null, null, $this->accessToken);
    }

    private function buildUserData(array $data): UserData
    {
        $userData = (new UserData())
            ->setClientIpAddress(request()->ip())
            ->setClientUserAgent(request()->userAgent());

        if (!empty($data['email'])) $userData->setEmail($data['email']);
        if (!empty($data['phone'])) $userData->setPhone($data['phone']);
        if (!empty($data['fbc']))   $userData->setFbc($data['fbc']);
        if (!empty($data['fbp']))   $userData->setFbp($data['fbp']);

        return $userData;
    }

    public function sendEvent(string $eventName, array $userData, CustomData $customData): void
    {
        $event = (new Event())
            ->setEventName($eventName)
            ->setEventTime(time())
            ->setEventSourceUrl(request()->fullUrl())
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($this->buildUserData($userData))
            ->setCustomData($customData);

        (new EventRequest($this->pixelId))
            ->setEvents([$event])
            ->execute();
    }

    public function trackPageView(array $userData): void
    {
        $this->sendEvent('PageView', $userData, new CustomData());
    }

    public function trackAddToCart(array $userData, array $product): void
    {
        $content = (new Content())
            ->setProductId((string) $product['id'])
            ->setQuantity($product['quantity'])
            ->setItemPrice($product['price']);

        $customData = (new CustomData())
            ->setContents([$content])
            ->setCurrency('tnd')
            ->setValue($product['price'] * $product['quantity'])
            ->setContentType('product');

        $this->sendEvent('AddToCart', $userData, $customData);
    }

    public function trackPurchase(array $userData, array $orderData): void
    {
        $contents = array_map(fn($item) => (new Content())
            ->setProductId((string) $item['id'])
            ->setQuantity($item['quantity'])
            ->setItemPrice($item['price']),
            $orderData['items']
        );

        $customData = (new CustomData())
            ->setContents($contents)
            ->setCurrency('tnd')
            ->setValue($orderData['total'])
            ->setContentType('product')
            ->setOrderId((string) $orderData['order_id']);

        $this->sendEvent('Purchase', $userData, $customData);
    }
}